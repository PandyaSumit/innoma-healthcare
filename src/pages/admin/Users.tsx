import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "../../api/admin.api";
import type { AdminUser, UserStage } from "../../types/admin";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import Input from "../../components/ui/Input";
import GroupButton from "../../components/ui/GroupButton";
import AdminTable from "../../components/admin/AdminTable";

const STAGE_BADGE: Record<UserStage, string> = {
  registered: "bg-gray-100 text-gray-600",
  free_assessment: "bg-blue-50 text-blue-700",
  paid_session: "bg-emerald-50 text-emerald-700",
};

const STAGE_LABEL: Record<UserStage, string> = {
  registered: "Registered",
  free_assessment: "Free Assessment",
  paid_session: "Paid Session",
};

const VERIFIED_BADGE = {
  true: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  false: "bg-amber-50 text-amber-600 border border-amber-100",
};

export default function Users() {
  const [stageFilter, setStageFilter] = useState<UserStage | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", stageFilter, search, page],
    queryFn: () =>
      fetchAdminUsers({
        stage: stageFilter === "all" ? undefined : stageFilter,
        search: search || undefined,
        page,
        limit: 10,
      }),
  });



  return (
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Users"
          description="Manage your patient accounts, track their progress, and communicate with them directly."
        />

        {/* Filters */}
        <section className="bg-white rounded-md border border-healthcare-border flex flex-col lg:flex-row lg:items-center gap-2">
          <GroupButton
            value={stageFilter}
            onChange={(v) => {
              setStageFilter(v as UserStage | "all");
              setPage(1);
            }}
            btns={[
              { label: "All Users", value: "all" },
              { label: "Registered", value: "registered" },
              { label: "Free Assessment", value: "free_assessment" },
              { label: "Paid Session", value: "paid_session" },
            ]}
          />

          <div className="relative lg:w-96 p-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-healthcare-text-muted/50">
              🔍
            </span>

            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="pl-12 pr-6"
            />
          </div>
        </section>

        {/* Users Table */}

        <AdminTable<AdminUser>
          data={data ? { data: data, meta: data } : undefined}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          emptyMessage="No patients matching your criteria were found."
          columns={[
            {
              header: "User",
              accessor: (u) => (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-sm font-bold text-brand-blue">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      u.name?.[0]?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-sm">{u.name}</p>
                    <p className="text-xs text-healthcare-text-muted">
                      {u.email}
                    </p>
                  </div>
                </div>
              ),
            },

            {
              header: "Verified",
              accessor: (u) => (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    VERIFIED_BADGE[u.isVerified ? "true" : "false"]
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      u.isVerified ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {u.isVerified ? "Verified" : "Unverified"}
                </span>
              ),
            },

            {
              header: "Joined",
              accessor: (u) => (
                <span className="text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              ),
              hiddenOnTablet: true,
            },

            {
              header: "Sessions",
              accessor: (u) => (
                <span className="font-bold text-sm">{u?.sessions}</span>
              ),
              hiddenOnMobile: true,
            },

            {
              header: "Stage",
              accessor: (u) => (
                <span
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${STAGE_BADGE[u.stage]}`}
                >
                  {STAGE_LABEL[u.stage]}
                </span>
              ),
            },
          ]}
        />
      </div>


    </>
  );
}
