// Server Component: aman diprerender
export default function LoginPage({ searchParams }) {
  const next = typeof searchParams?.next === "string" && searchParams.next.length
    ? searchParams.next
    : "/identitas";

  return <LoginClient next={next} />;
}

// Import komponen client dengan lazy (opsional), atau langsung import default
import LoginClient from "./LoginClient";
