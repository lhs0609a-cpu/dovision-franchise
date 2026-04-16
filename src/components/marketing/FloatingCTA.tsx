"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 p-3 backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <a href="tel:0507-1434-3226" className="flex-1">
          <Button variant="outline" className="w-full">
            <Phone className="mr-2 h-4 w-4" />
            전화 상담
          </Button>
        </a>
        <Link href="/contact" className="flex-1">
          <Button className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            상담 신청
          </Button>
        </Link>
      </div>
    </div>
  );
}
