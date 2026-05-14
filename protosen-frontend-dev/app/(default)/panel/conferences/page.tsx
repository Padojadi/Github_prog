"use client";
import Link from "next/link";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConferenceCard } from "@/features/conferences/components/conference-card";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { useQueryState } from "nuqs";
import { useGetInfiniteConferences } from "@/features/conferences/hooks/use-get-conferences";
import { useDebounce } from "@/hooks/use-debounce";
import LoadingComponent from "@/components/loadingComponent";
import ErrorComponent from "@/components/error";

export default function ConferencesPage() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isFetchingNextPage,
    error,
    isFetching,
    fetchNextPage,
    status,
    hasNextPage,
    refetch,
  } = useGetInfiniteConferences(1, debouncedSearch);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Conférences</h1>
          <Input
            placeholder="Rechercher conferences..."
            value={search}
            onChange={(e) => setSearch(e.target.value.trim())}
            className="max-w-md"
          />
        </div>

        {isFetching && <LoadingComponent />}
        {!isFetching && status === "success" && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data && data.pages.length > 0 ? (
                data.pages.map((page) =>
                  page.data.conferences.map((conference) => (
                    <ConferenceCard
                      key={conference.id}
                      conference={conference}
                    />
                  ))
                )
              ) : (
                <div className="text-center">Aucune conférence trouvée</div>
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
