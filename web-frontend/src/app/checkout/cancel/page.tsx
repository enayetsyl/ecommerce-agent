"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ShoppingBag, ShoppingCart } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Checkout Cancelled</h1>
            <p className="text-muted-foreground mb-8">
              Your checkout session was cancelled. No charges were made. Your
              cart items have been saved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cart">
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Return to Cart
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

