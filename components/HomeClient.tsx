"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    title: "Comprehensive Course Library",
    description:
      "Access a wide range of carefully curated courses designed by university professors and industry experts.",
    icons: "📚",
  },
  {
    title: "Interactive Learning Experience",
    description:
      "Engage with interactive content, including quizzes, assignments, and discussion forums to enhance your learning journey.",
    icons: "🎓",
  },
  {
    title: "Progress and Analytics",
    description:
      "Monitor your learning progress with detailed analytics and personalized insights to help you stay on track.",
    icons: "📈",
  },
  {
    title: "Community and Collaboration",
    description:
      "Join a vibrant community of learners, collaborate on projects, and share knowledge to foster a supportive learning environment.",
    icons: "🤝",
  },
];

export default function HomeClient({
  session,
}: {
  session: { user: { name: string } } | null;
}) {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>The Future of Tetiary Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Education Experience
          </h1>
          <p className="max-w-175 text-muted-foreground md:text-xl">
            Discover a new way to learn and grow with our modern, interactive
            learning platform. Access high-quality educational content anytime,
            anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>
            {session ? (
              ""
            ) : (
              <Link
                href="/login"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 mb-32 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => {
          return (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4 ">{feature.icons}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
