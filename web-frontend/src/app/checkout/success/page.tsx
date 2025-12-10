"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShoppingBag, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [orderProcessed, setOrderProcessed] = useState(false);

  useEffect(() => {
    // Clear cart after successful checkout
    if (sessionId && !orderProcessed) {
      clearCart();
      setOrderProcessed(true);
    }
  }, [sessionId, orderProcessed, clearCart]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been successfully
              processed.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground mb-8">
                Order ID: {sessionId}
              </p>
            )}
            <p className="text-muted-foreground mb-8">
              You will receive an email confirmation shortly with your order
              details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" size="lg" className="gap-2">
                  <Package className="h-5 w-5" />
                  View Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

