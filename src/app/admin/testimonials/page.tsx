import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { deleteTestimonial, toggleTestimonialPublish } from "@/actions/testimonial";

export default async function AdminTestimonialsPage() {
  let testimonials: {
    id: string;
    studentName: string;
    grade: string;
    achievement: string;
    isPublished: boolean;
    order: number;
  }[] = [];

  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">성과사례 관리</h1>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            새 성과사례
          </Button>
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-muted-foreground">등록된 성과사례가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">#{item.order}</span>
                  <div>
                    <p className="font-medium">{item.studentName} ({item.grade})</p>
                    <p className="text-sm text-muted-foreground">{item.achievement}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.isPublished ? "default" : "secondary"}>
                    {item.isPublished ? "공개" : "비공개"}
                  </Badge>
                  <form
                    action={async () => {
                      "use server";
                      await toggleTestimonialPublish(item.id, !item.isPublished);
                    }}
                  >
                    <Button variant="outline" size="sm" type="submit">
                      {item.isPublished ? "비공개" : "공개"}
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await deleteTestimonial(item.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      삭제
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
