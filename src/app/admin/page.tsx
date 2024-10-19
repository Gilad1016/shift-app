"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { read, utils, writeFile } from "xlsx";
import { supabase } from "../../utils/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface Preference {
  email: string;
  unavailableDates: Set<string>;
}

interface AllocationEntry {
  worker: string;
  date: string;
}

interface Worker {
  id: number;
  name: string;
  email: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const Form = styled.form`
  margin-top: 20px;
`;

const Label = styled.label`
  display: block;
  margin-top: 15px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-top: 5px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 1em;
  cursor: pointer;
`;

const AllocationContainer = styled.div`
  margin-top: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 10px;
  background: #f5f5f5;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 10px;
`;

const AdminPage = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [numDays, setNumDays] = useState<number>(7); // Default to a week
  const [file, setFile] = useState<File | null>(null);
  const [allocation, setAllocation] = useState<AllocationEntry[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for authentication
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      } else {
        setSession(data.session);
        fetchWorkers();
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  // Fetch workers from Supabase
  const fetchWorkers = async () => {
    const { data, error } = await supabase.from("workers").select("*");
    if (error) {
      console.error("Error fetching workers:", error);
    } else {
      setWorkers(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a preferences spreadsheet.");
      return;
    }
    if (workers.length === 0) {
      alert("No workers available. Please add workers first.");
      return;
    }
    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Read the worksheet as an array of arrays, skipping the header
      const sheetData: (string | number | undefined)[][] = utils.sheet_to_json(
        worksheet,
        { header: 1 }
      );
      const rows = sheetData.slice(1);

      // Map to collect preferences
      const preferencesMap = new Map<string, Set<string>>();

      for (const row of rows) {
        // Assuming columns: 0 - timestamp, 1 - worker's email, 2 and onwards - unavailable dates
        const emailCell = row[1];
        const email =
          typeof emailCell === "string"
            ? emailCell.trim()
            : emailCell?.toString().trim();

        if (!email) continue;

        // Collect all dates from columns 2 onwards
        const dates = row
          .slice(2)
          .filter((cell): cell is string | number => cell != null)
          .map((dateCell) => dateCell.toString().trim());

        if (dates.length === 0) continue;

        // Initialize the set if not already present
        if (!preferencesMap.has(email)) {
          preferencesMap.set(email, new Set());
        }

        const unavailableDates = preferencesMap.get(email)!;

        for (const date of dates) {
          unavailableDates.add(date);
        }
      }

      // Convert map to array of preferences
      const preferences: Preference[] = [];
      preferencesMap.forEach((unavailableDates, email) => {
        preferences.push({ email, unavailableDates });
      });

      // Use workers from Supabase
      const result = generateAllocation(preferences, numDays, workers);
      setAllocation(result);
    } catch (error) {
      console.error("Error processing file:", error);
      alert(
        "There was an error processing the file. Please check the file format and try again."
      );
    }
  };

  const generateAllocation = (
    preferences: Preference[],
    numDays: number,
    workers: Worker[]
  ): AllocationEntry[] => {
    const allocationResult: AllocationEntry[] = [];
    const today = new Date();
    const dates: string[] = [];

    // Generate dates for allocation
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      dates.push(dateString);
    }

    // Map email to worker names
    const emailToWorkerName = new Map<string, string>();
    workers.forEach((worker) => {
      emailToWorkerName.set(worker.email, worker.name);
    });

    // Assign shifts
    for (const date of dates) {
      let assigned = false;
      for (const preference of preferences) {
        // Skip if the worker is unavailable on this date
        if (preference.unavailableDates.has(date)) {
          continue;
        }
        // Assign the worker to this date
        const workerName =
          emailToWorkerName.get(preference.email) || preference.email;
        allocationResult.push({ worker: workerName, date });
        assigned = true;
        break;
      }
      if (!assigned) {
        allocationResult.push({ worker: "Unassigned", date });
      }
    }

    return allocationResult;
  };

  const handleDownload = () => {
    const worksheet = utils.json_to_sheet(allocation);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Allocation");
    writeFile(workbook, "shift_allocation.xlsx");
  };

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Title>Shift Allocation Admin</Title>
      {session && <p>Welcome, {session.user.email}</p>}
      <Button onClick={handleLogout}>Logout</Button>
      <Form onSubmit={handleSubmit}>
        <Label>
          Number of Days:
          <Input
            type="number"
            value={numDays}
            onChange={(e) => setNumDays(parseInt(e.target.value))}
          />
        </Label>
        <Label>
          Upload Preferences Spreadsheet:
          <Input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
        </Label>
        <Button type="submit">Generate Allocation</Button>
      </Form>

      {allocation.length > 0 && (
        <AllocationContainer>
          <h2>Shift Allocation</h2>
          <Table>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Worker</TableHeader>
              </tr>
            </thead>
            <tbody>
              {allocation.map((entry, index) => (
                <tr key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.worker}</TableCell>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={handleDownload}>Download Allocation</Button>
        </AllocationContainer>
      )}
    </Container>
  );
};

export default AdminPage;
