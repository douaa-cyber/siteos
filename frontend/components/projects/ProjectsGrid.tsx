"use client";

import { useState } from "react";
import { Plus } from "@/components/ui/Icons";
import ProjectCard from "./ProjectCard";
import { ProjectSummary } from "@/types/dashboard";
import NewProjectModal from "./NewProjectModal";

interface Props {
  projects: ProjectSummary[];
}

export default function ProjectsGrid({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A10]">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#22D3EE] opacity-[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-[#A78BFA] opacity-[0.10] blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[12px] text-[#6B6875] [font-family:var(--font-mono)]">
              {projects.length} active{" "}
              {projects.length === 1 ? "project" : "projects"}
            </span>
            <h1 className="mt-1 text-[2.4rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
              Projects
            </h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#22D3EE,#A78BFA)" }}
          >
            <Plus size={16} />
            New project
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              delay={index * 70}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-[#6B6875]">
            No projects yet — create your first one to get started.
          </div>
        )}
      </div>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(project) => setProjects((prev) => [project, ...prev])}
      />
    </main>
  );
}
