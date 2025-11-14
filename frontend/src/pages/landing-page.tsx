import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useAuth } from "../lib/auth-context";
import { api } from "../lib/api";
import {
  Check,
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Smartphone,
  Cloud,
  Clock,
  HeadphonesIcon,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for small businesses",
    features: [
      "1 Store Location",
      "Up to 500 Products",
      "Basic Inventory Management",
      "Sales Reports",
      "Email Support",
      "1 User Account",
      "Mobile App Access",
    ],
    popular: false,
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    description: "For growing businesses",
    features: [
      "3 Store Locations",
      "Up to 2,000 Products",
      "Advanced Inventory Management",
      "Multi-store Transfers",
      "Low Stock Alerts",
      "Tax Management",
      "Priority Support",
      "5 User Accounts",
      "QR Code Generation",
      "Offline Mode",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    description: "For large operations",
    features: [
      "Unlimited Store Locations",
      "Unlimited Products",
      "Full Feature Access",
      "Advanced Analytics",
      "API Access",
      "Custom Integrations",
      "Dedicated Support",
      "Unlimited Users",
      "White Label Option",
      "Custom Training",
      "SLA Guarantee",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const features = [
  {
    icon: ShoppingCart,
    title: "Point of Sale",
    description:
      "Fast, intuitive POS system with barcode scanning and multiple payment methods",
  },
  {
    icon: Package,
    title: "Inventory Management",
    description:
      "Real-time tracking with low stock alerts and automated reordering",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Detailed insights into sales, inventory, and employee performance",
  },
  {
    icon: Users,
    title: "Multi-Store Support",
    description: "Manage multiple locations from a single dashboard",
  },
  {
    icon: Zap,
    title: "Offline Mode",
    description: "Continue working without internet, sync when connected",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Bank-level security with automatic backups and data encryption",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Store Manager, RetailPro",
    content:
      "Maartly transformed our inventory management. We reduced stockouts by 85% and increased efficiency by 60%.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CEO, TechSupply Co.",
    content:
      "The POS system is incredibly fast. Our checkout time dropped from 3 minutes to 45 seconds per customer.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Operations Director, MultiStore Inc.",
    content:
      "Managing 5 locations has never been easier. Real-time sync and analytics help us make better decisions.",
    rating: 5,
  },
];

export function LandingPage() {
  const { login } = useAuth();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [signupData, setSignupData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    plan: "professional",
    slug: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.signup(signupData);
      setSuccess(
        "Registration successful! Please check your email to verify your account and set your password."
      );
      setSignupData({
        businessName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        plan: "professional",
        slug: "",
      });
      setTimeout(() => {
        setIsSignupOpen(false);
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      setIsLoginOpen(false);
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.forgotPassword(forgotPasswordEmail);
      setSuccess("Password reset link sent! Please check your email.");
      setForgotPasswordEmail("");
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Maartly</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-primary">
              Features
            </a>
            <a href="#pricing" className="text-sm hover:text-primary">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm hover:text-primary">
              Testimonials
            </a>
            <Button variant="ghost" onClick={() => setIsLoginOpen(true)}>
              Login
            </Button>
            <Button onClick={() => setIsSignupOpen(true)}>Get Started</Button>
          </div>
          <div className="md:hidden">
            <Button onClick={() => setIsSignupOpen(true)}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Trusted by 10,000+ businesses</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Inventory Management Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete point-of-sale and inventory system designed for modern
              businesses. Increase efficiency, reduce costs, and grow faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => setIsSignupOpen(true)}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">14-day free trial</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <Card className="relative">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">$127,450</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="text-xl font-bold">2,847</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-xl font-bold">1,429</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to run your business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline operations and boost
              productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Multi-language Support</h4>
                <p className="text-sm text-muted-foreground">
                  Available in English, Spanish, French, and more
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mobile Apps</h4>
                <p className="text-sm text-muted-foreground">
                  iOS and Android apps for on-the-go management
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Cloud className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cloud-Based</h4>
                <p className="text-sm text-muted-foreground">
                  Access from anywhere, automatic backups included
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Real-time Sync</h4>
                <p className="text-sm text-muted-foreground">
                  Instant updates across all devices and locations
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <HeadphonesIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Expert support team ready to help anytime
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Enterprise Security</h4>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption and regular security audits
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your business. All plans include a
              14-day free trial.
            </p>
          </div>

          <Tabs defaultValue="monthly" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annually">
                Annually
                <Badge className="ml-2 bg-green-600">Save 20%</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div className="grid md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={plan.popular ? "border-primary shadow-lg" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        {plan.popular && (
                          <Badge className="bg-primary">Most Popular</Badge>
                        )}
                      </div>
                      <div>
                        <span className="text-4xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full mb-6"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => setIsSignupOpen(true)}
                      >
                        {plan.cta}
                      </Button>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="annually">
              <div className="grid md:grid-cols-3 gap-8">
                {pricingPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={plan.popular ? "border-primary shadow-lg" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        {plan.popular && (
                          <Badge className="bg-primary">Most Popular</Badge>
                        )}
                      </div>
                      <div>
                        <span className="text-4xl font-bold">
                          ${Math.round(plan.price * 0.8)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed ${Math.round(plan.price * 0.8 * 12)}/year
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full mb-6"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => setIsSignupOpen(true)}
                      >
                        {plan.cta}
                      </Button>
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Loved by businesses worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about Maartly
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.content}"
                  </p>
                  <Separator className="my-4" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses using Maartly to streamline operations
            and boost growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsSignupOpen(true)}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">Maartly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete inventory management solution for modern businesses
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Maartly. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start Your Free Trial</DialogTitle>
            <DialogDescription>
              No credit card required. Get started in under 2 minutes.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={signupData.businessName}
                onChange={(e) =>
                  setSignupData({ ...signupData, businessName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={signupData.firstName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={signupData.lastName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={signupData.phone}
                onChange={(e) =>
                  setSignupData({ ...signupData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Store Slug{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Input
                id="slug"
                placeholder="your-store-name"
                value={signupData.slug}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Your store will be available at:{" "}
                <span className="font-mono">
                  {signupData.slug || "your-slug"}.maartly.com
                </span>
                {!signupData.slug && (
                  <span className="block mt-1">
                    Leave empty to auto-generate from your business name
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Select Plan</Label>
              <select
                id="plan"
                className="w-full border rounded-md p-2"
                value={signupData.plan}
                onChange={(e) =>
                  setSignupData({ ...signupData, plan: e.target.value })
                }
              >
                <option value="starter">Starter - $29/month</option>
                <option value="professional">Professional - $79/month</option>
                <option value="enterprise">Enterprise - $199/month</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSignupOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSignup} disabled={loading}>
              {loading ? "Processing..." : "Start Free Trial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>Login to your Maartly account</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="loginEmail">Email</Label>
              <Input
                id="loginEmail"
                type="email"
                placeholder="your@email.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loginPassword">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsForgotPasswordOpen(true);
                    setError("");
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="loginPassword"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLoginOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="forgotPasswordEmail">Email</Label>
              <Input
                id="forgotPasswordEmail"
                type="email"
                placeholder="your@email.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setIsLoginOpen(true);
                setError("");
              }}
              disabled={loading}
            >
              Back to Login
            </Button>
            <Button
              onClick={handleForgotPassword}
              disabled={loading || !forgotPasswordEmail}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
