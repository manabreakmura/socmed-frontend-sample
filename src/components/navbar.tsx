import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <NavigationMenu className="p-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">socmed-frontend-sample</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <ModeToggle />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
