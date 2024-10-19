// src/components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";
import styled from "styled-components";
import { Session } from "@supabase/supabase-js"; // Import Session type

const Nav = styled.nav`
  /* Styling for the navbar */
`;

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null); // Specify the type

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Nav>
      <Link href="/">Home</Link>
      {session ? (
        <>
          <Link href="/admin">Admin</Link>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </Nav>
  );
};

export default Navbar;
