import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Voice Commerce
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing products with our voice-enabled shopping experience.
          Browse, search, and shop with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </CardTitle>
            <CardDescription>
              Explore our wide range of products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button variant="link" className="p-0">
                View Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice Search</CardTitle>
            <CardDescription>
              Coming soon: Search products using your voice
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Easy Shopping</CardTitle>
            <CardDescription>
              Simple and intuitive shopping experience
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
