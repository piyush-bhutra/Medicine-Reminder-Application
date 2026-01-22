import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";

const Contact = () => (
  <DashboardLayout>
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Contact Us</CardTitle>
          <p className="text-muted-foreground">We'd love to hear from you</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Your Name" />
          <Input type="email" placeholder="Your Email" />
          <Textarea placeholder="Your Message" className="min-h-[120px]" />
          <Button className="w-full gap-2"><Mail className="h-4 w-4" /> Send Message</Button>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Contact;
