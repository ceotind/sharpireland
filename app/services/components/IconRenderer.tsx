import React from "react";
import {
  Rocket,
  Atom,
  Gear,
  Sparkle,
  Link,
  CheckCircle,
  AndroidLogo,
  AppleLogo,
  DeviceMobile,
  Globe,
  Lightning,
  Lock,
  Eye,
  FloppyDisk,
  Calendar,
  ChatCircle,
  ChartBar,
  Star,
  MagnifyingGlass,
  PencilSimple,
  Target,
  Users,
  TestTube,
  CurrencyDollar,
  TrendUp,
  Envelope,
  Package,
  ArrowsClockwise,
  User,
  EnvelopeSimple,
  Bell,
  ArrowRight,
  Code,
  Robot,
  Crosshair,
  Palette,
  ChartPie,
  FlowArrow,
  Plugs,
  Monitor,
  ChartLineUp,
  PresentationChart,
  Heart,
  FileText,
  Briefcase,
  Smiley,
  Clock
} from "@phosphor-icons/react";
import { IconConfig } from "../data/services-content";

// Map of icon names to components
const iconMap = {
  Rocket,
  Atom,
  Gear,
  Sparkle,
  Link,
  CheckCircle,
  AndroidLogo,
  AppleLogo,
  DeviceMobile,
  Globe,
  Lightning,
  Lock,
  Eye,
  FloppyDisk,
  Calendar,
  ChatCircle,
  ChartBar,
  Star,
  MagnifyingGlass,
  PencilSimple,
  Target,
  Users,
  TestTube,
  CurrencyDollar,
  TrendUp,
  Envelope,
  Package,
  ArrowsClockwise,
  User,
  EnvelopeSimple,
  Bell,
  ArrowRight,
  Code,
  Robot,
  Crosshair,
  Palette,
  ChartPie,
  FlowArrow,
  Plugs,
  Monitor,
  ChartLineUp,
  PresentationChart,
  Heart,
  FileText,
  Briefcase,
  Smiley,
  Clock
};

interface IconRendererProps {
  icon: IconConfig;
  className?: string;
}

export default function IconRenderer({ icon, className }: IconRendererProps) {
  const IconComponent = iconMap[icon.name as keyof typeof iconMap];
  
  if (!IconComponent) {
    console.warn(`Icon "${icon.name}" not found in iconMap`);
    return null;
  }
  
  return <IconComponent size={icon.size} className={className} />;
}