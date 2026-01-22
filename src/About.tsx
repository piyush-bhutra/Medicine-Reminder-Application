import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Clock, Users } from "lucide-react";

const About = () => (
  <DashboardLayout>
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold">About MedCompanion</h1>
        <p className="text-muted-foreground mt-2">Your trusted medicine reminder system aligned with SDG 3</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Shield, title: "Privacy First", desc: "Your health data is encrypted and secure" },
          { icon: Clock, title: "Smart Reminders", desc: "Intelligent scheduling that learns your habits" },
          { icon: Users, title: "SDG 3 Aligned", desc: "Promoting good health and well-being for all" },
          { icon: Heart, title: "Built with Care", desc: "Designed to support your health journey" },
        ].map((item) => (
          <Card key={item.title}><CardContent className="p-6 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.desc}</p></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default About;
