// src/app/register/page.tsx
"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import Logo from "../../../assets/Shift-Logo.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 0 20px;
  text-align: center;
`;

const LogoWrapper = styled.div`
  width: 100px;
  margin-bottom: 1rem;
  & img {
    width: 100%;
    height: auto;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #0070f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #005bb5;
  }
`;

const Message = styled.p`
  color: red;
`;

const SuccessMessage = styled.p`
  color: green;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Footer = styled.footer`
  font-size: 0.875rem;
  color: #aaa;
  margin-top: 1.5rem;
`;

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        "Registration successful! Please check your email to confirm your account."
      );
      router.push("/login"); // Optionally redirect after successful registration
    }
  };

  return (
    <Container>
      <LogoWrapper>
        <Image src={Logo} alt="Shift App Logo" width={150} height={150} />
      </LogoWrapper>
      <Title>Create Your Account</Title>
      {error && <Message>{error}</Message>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <Form onSubmit={handleRegister}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Register</Button>
      </Form>
      <Footer>© 2024 Shift Scheduler - All Rights Reserved</Footer>
    </Container>
  );
};

export default RegisterPage;
