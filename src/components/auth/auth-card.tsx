import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12">
      <Link href="/" className="mb-8">
        <Image
          src="/planify.svg"
          alt="Planify"
          width={624}
          height={173}
          className="h-8 w-auto"
          priority
        />
      </Link>
      <Card className="w-full max-w-sm py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="px-6">{children}</CardContent>
      </Card>
      <p className="mt-6 text-sm text-muted-foreground">
        {footerText}{" "}
        <Link
          href={footerLinkHref}
          className="font-medium text-primary hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  );
}
