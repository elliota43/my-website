import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

function NavBar() {
    return (
        <NavigationMenu className="w-full flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3 font-mono text-lg font-semibold tracking-wide text-terminal-highlight">
                <span className="text-terminal-highlight/70">///</span>
                elliot
            </div>
            <NavigationMenuList className="flex-wrap justify-center gap-1.5 sm:justify-end">
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
                        home
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/blogs">
                        blogs
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/projects">
                        projects
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/about">
                        about
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default NavBar;
