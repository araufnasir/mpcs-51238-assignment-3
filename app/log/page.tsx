import type { Metadata } from "next";
import Card from "../components/Card";
import SessionForm from "../components/SessionForm";
import { type } from "../components/type";

export const metadata: Metadata = { title: "Log a session" };

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className={type.title}>Log a session</h1>
      <Card>
        <SessionForm />
      </Card>
    </div>
  );
}
