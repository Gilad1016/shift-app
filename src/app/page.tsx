// src/app/page.tsx
"use client";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../assets/Shift-Logo.png";

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

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const LogoWrapper = styled.div`
  margin-bottom: 1rem;
  width: 30%;

  & img {
    width: 100%;
    height: auto;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
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

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  font-size: 0.875rem;
  color: #aaa;
`;

const HomePage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <Container>
      <Header>
        <LogoWrapper>
          <Image
            src={Logo}
            alt="Shift App Logo"
            style={{ objectFit: "contain" }}
          />
        </LogoWrapper>
      </Header>
      <Title>Welcome to Shift Scheduler</Title>
      <Subtitle>Efficiently manage your workforce shifts with ease.</Subtitle>
      <ButtonGroup>
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleRegister}>Register</Button>
      </ButtonGroup>
      <Footer>© 2024 Shift Scheduler - All Rights Reserved</Footer>
    </Container>
  );
};

export default HomePage;
