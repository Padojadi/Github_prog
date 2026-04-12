"use client";
import { ChevronLeft, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import LoadingComponent from "@/components/loadingComponent";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Input } from "@/components/ui/input";
import { useGetInfiniteConferencesPublic } from "@/features/conferences/hooks/use-get-conferences";
import { ConferenceCardHome } from "@/features/home/components/conference-card";
import { useDebounce } from "@/hooks/use-debounce";

export default function ConferencesSectionWeb() {
	const [search, setSearch] = useQueryState("search", { defaultValue: "" });

	const debouncedSearch = useDebounce(search, 500);

	const {
		data,
		isFetchingNextPage,
		isFetching,
		fetchNextPage,
		status,
		hasNextPage,
	} = useGetInfiniteConferencesPublic(1, debouncedSearch);

	const clearFilters = () => {
		setSearch("");
	};

	return (
		<div className="container-custom py-12 md:py-16 lg:py-24 min-h-[80dvh]">
			<Link
				href="/"
				className="inline-flex items-center text-foreground/80 hover:text-foreground transition-colors mb-6"
			>
				<ChevronLeft className="w-4 h-4 mr-1" /> Retour à l'acceuil
			</Link>
			<div className="flex flex-col items-center text-center mb-8 md:mb-12 animate-fade-in">
				<h1 className="text-3xl md:text-4xl font-bold mb-4">
					Conférences à venir
				</h1>
				<p className="text-muted-foreground max-w-2xl">
					Découvrez les conférences à venir et inscrivez-vous. Rejoignez les
					leaders de l'industrie et les innovateurs lors de ces événements de
					premier plan.
				</p>
			</div>

			{/* Search and filter section - sticky on scroll */}
			<div className="sticky top-20 z-10 backdrop-blur-sm py-4 shadow-sm mb-8 animate-slide-up">
				<div className="mb-4">
					<div className="relative max-w-2xl mx-auto">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
						<Input
							type="search"
							placeholder="Rechercher des conferences par titre ou lieu..."
							className="pl-10"
							value={search}
							onChange={(e) => setSearch(e.target.value.trim())}
						/>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row items-center justify-between max-w-2xl mx-auto">
					<div className="flex items-center gap-2 mb-2 sm:mb-0">
						{debouncedSearch && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearFilters}
								className="text-muted-foreground"
							>
								<X className="h-4 w-4 mr-1" />
								Effacer les filtres
							</Button>
						)}
					</div>

					<div className="text-sm text-muted-foreground">
						Affichage de{" "}
						{data?.pages.flatMap((item) => item.data.conferences).length}{" "}
						conferences sur {data?.pages[0].data.total} conferences
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-8">
				{/* <div className="flex items-center gap-4">
          <Input
            placeholder="Rechercher conferences..."
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            className="max-w-sm"
          />

        </div> */}
				{isFetching && <LoadingComponent />}
				{!isFetching && status === "success" && (
					<>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{data && data.pages.length > 0 ? (
								data.pages.map((page) =>
									page.data.conferences.map((conference, index) => (
										<div
											key={conference.id}
											className="animate-fade-in"
											style={{ animationDelay: `${index * 0.05}s` }}
										>
											<ConferenceCardHome
												key={conference.id}
												conference={conference}
											/>
										</div>
									)),
								)
							) : (
								<div className="col-span-full text-center py-12 animate-fade-in">
									<div className="max-w-md mx-auto">
										<Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
										<h3 className="text-xl font-medium mb-2">
											Aucune conference trouvé
										</h3>
										<p className="text-muted-foreground mb-4">
											Nous n'avons pas trouvé de conférences correspondant à vos
											critères de recherche. Essayez d'ajuster vos filtres ou
											vos termes de recherche.
										</p>
										<Button onClick={clearFilters}>Effacer les filtres</Button>
									</div>
								</div>
							)}
						</div>
						<InfiniteScroll
							hasMore={hasNextPage}
							isLoading={isFetching || isFetchingNextPage}
							next={fetchNextPage}
						>
							{hasNextPage && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
						</InfiniteScroll>
					</>
				)}
				{/* {status === "error" && <ErrorComponent error={error} retry={refetch} />} */}
			</div>
		</div>
	);
}
