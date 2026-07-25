"use client";
import { Calendar, ChevronDown, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { webLinks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { NavUser } from "../nav-user";
import ThemeToggle from "../theme-toggle";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { LinkCustom } from "../ui/navigation-menu-link";

export default function WebNavbar() {
	const currentUser = useCurrentUser();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isServicesOpen, setIsServicesOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 w-full z-50 transition-all duration-300",
				isScrolled
					? "bg-background/90 backdrop-blur-md shadow-sm"
					: "bg-transparent",
			)}
		>
			<div className="container-custom flex items-center justify-between h-16 md:h-20">
				<div className="flex items-center gap-8">
					<Link
						href="/"
						className="flex items-center gap-2 transition-opacity hover:opacity-80"
					>
						<div className="flex items-center justify-start h-16">
							<img
								src="/images/logo.png"
								alt="Logo Protosen"
								className="h-8 w-auto"
							/>{" "}
							<span
								className={cn(
									"text-2xl text-foreground font-bold hidden md:inline-block ml-2 uppercase",
									!isScrolled && "text-white",
								)}
							>
								Protosen
							</span>
						</div>
					</Link>

					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList className="gap-6">
							{webLinks.map((item) => (
								<NavigationMenuItem
									key={item.label}
									className="text-foreground/80 hover:text-foreground hover:bg-transparent"
								>
									{item.children.length > 0 ? (
										<>
											<NavigationMenuTrigger className="px-0 py-0">
												{item.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="w-56 md:w-56 rounded-xl bg-gradient-footer dark:bg-gradient-footer-dark shadow-lg p-3">
												{item.children.map((subItem) => (
													<LinkCustom
														key={subItem.label}
														href={subItem.href}
														className="flex gap-2 items-center p-2 rounded-xl hover:bg-muted"
													>
														{subItem.icon}
														{subItem.label}
													</LinkCustom>
												))}
												<div className="p-2 text-muted-foreground text-sm">
													D'autres services seront bientôt disponibles
												</div>
											</NavigationMenuContent>
										</>
									) : (
										<LinkCustom href={item.href}>{item.label}</LinkCustom>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
					{/* <nav className="hidden md:flex items-center gap-6">
            <div className="relative">
              <button
                className="flex items-center gap-1 text-foreground/80 hover:text-foreground"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services <ChevronDown className="w-4 h-4" />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-lg bg-white shadow-lg p-3 animate-fade-in">
                  <Link
                    to="/"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium">Conferences</span>
                  </Link>
                  <div className="p-2 text-muted-foreground text-sm">
                    More services coming soon
                  </div>
                </div>
              )}
            </div>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              About
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              Pricing
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-foreground">
              Support
            </Link>
          </nav> */}
				</div>

				<div className="flex items-center gap-3 md:gap-5">
					<ThemeToggle />
					{/* <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conferences..."
              className="h-10 pl-9 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary/20 w-40 lg:w-64 transition-all"
            />
          </div> */}

					{/* <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>

          <Button className="hidden md:flex bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-white">
            <Calendar className="w-4 h-4 mr-2" /> Create Conference
          </Button> */}
					{currentUser?.email ? (
						<NavUser isScrolled={isScrolled} />
					) : (
						<Link href="/signin">
							<Button
								variant="outline"
								className="hidden md:flex hover:shadow-lg border-border"
							>
								<LogIn className="w-4 h-4 mr-2" /> Se connecter
							</Button>
						</Link>
					)}

					{currentUser.email && (
						<div className="md:hidden">
							<NavUser isScrolled={isScrolled} />
						</div>
					)}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-background border-t animate-fade-in">
					<div className="container-custom py-4 space-y-4">
						{/* <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conferences..."
                className="h-10 pl-9 pr-4 rounded-full bg-muted border-none focus:ring-2 focus:ring-primary/20 w-full"
              />
            </div> */}

						<nav className="space-y-3">
							{/*<div>
                <button
                type="button"
                  className="flex items-center justify-between w-full p-2 border-b"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  <span>Services</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 py-2 space-y-2 animate-fade-in">
                    <Link
                      href="/conferences"
                      className="flex items-center gap-2 p-2"
                      onClick={() => {
                        setIsServicesOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Conferences</span>
                    </Link>
                  </div>
                )}
              </div>*/}
							{webLinks.map((item) => (
								<>
									{item.children.length === 0 && (
										<Link
											href={item.href}
											className="block p-2 border-b"
											onClick={() => setIsMobileMenuOpen(false)}
										>
											{item.label}
										</Link>
									)}
								</>
							))}

							{!currentUser.email && (
								<div className="pt-2">
									<Link
										href="/signin"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										<Button
											variant="outline"
											className="w-full border-foreground"
										>
											<LogIn className="w-4 h-4 mr-2" /> Se connecter
										</Button>
									</Link>
								</div>
							)}
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}
