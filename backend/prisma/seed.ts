import "dotenv/config";
import prisma from "../src/config/prisma";
import { Prisma } from "../generated/prisma/client";

async function main() {
  console.log("🌱 Starting SiteOS seed...");

  // ─────────────────────────────────────
  // Categories
  // ─────────────────────────────────────

  const categories = [
    "Materials",
    "Labor",
    "Transport",
    "Equipment",
    "Subcontracting",
    "Other",
  ];

  const categoryMap: Record<string, string> = {};

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    categoryMap[name] = category.id;
  }

  console.log("✅ Categories created");

  // ─────────────────────────────────────
  // Project
  // ─────────────────────────────────────

  const project = await prisma.project.create({
    data: {
      name: "Villa Hydra",
      location: "Hydra, Algiers",
      clientName: "Ahmed Benali",
      budget: new Prisma.Decimal(20_000_000),
      progress: 43,
      status: "ACTIVE",

      startDate: new Date("2026-05-01"),
      expectedEndDate: new Date("2026-11-30"),
    },
  });

  console.log(`✅ Project created: ${project.name}`);

  // ─────────────────────────────────────
  // Expenses
  // ─────────────────────────────────────

  const expenses = [
    {
      category: "Materials",
      description: "Cement - 500 bags",
      amount: 2_250_000,
      supplier: "Cimenterie Lafarge",
      paymentMethod: "Bank Transfer",
      date: "2026-05-05",
      notes: "Foundation and structural work",
    },
    {
      category: "Materials",
      description: "Steel reinforcement bars",
      amount: 2_850_000,
      supplier: "AlgerSteel",
      paymentMethod: "Bank Transfer",
      date: "2026-05-15",
      notes: "12mm and 16mm reinforcement bars",
    },
    {
      category: "Materials",
      description: "Bricks and construction blocks",
      amount: 950_000,
      supplier: "Brique Plus",
      paymentMethod: "Cash",
      date: "2026-05-28",
      notes: "Interior and exterior walls",
    },
    {
      category: "Labor",
      description: "Construction workers - May",
      amount: 1_600_000,
      supplier: "Site Workers",
      paymentMethod: "Cash",
      date: "2026-05-31",
      notes: "Masonry and structural workers",
    },
    {
      category: "Transport",
      description: "Material delivery",
      amount: 450_000,
      supplier: "TransLog DZ",
      paymentMethod: "Cash",
      date: "2026-06-03",
      notes: "Three truck deliveries",
    },
    {
      category: "Equipment",
      description: "Concrete mixer rental",
      amount: 700_000,
      supplier: "BuildRent",
      paymentMethod: "Bank Transfer",
      date: "2026-06-10",
      notes: "Two-week rental",
    },
    {
      category: "Labor",
      description: "Construction workers - June",
      amount: 1_350_000,
      supplier: "Site Workers",
      paymentMethod: "Cash",
      date: "2026-06-30",
      notes: "Masonry and finishing preparation",
    },
    {
      category: "Materials",
      description: "Sand and gravel",
      amount: 550_000,
      supplier: "Carriere El Harrach",
      paymentMethod: "Cash",
      date: "2026-07-05",
      notes: "Concrete and masonry work",
    },
    {
      category: "Subcontracting",
      description: "Electrical installation - first phase",
      amount: 350_000,
      supplier: "ElectroPro",
      paymentMethod: "Bank Transfer",
      date: "2026-07-12",
      notes: "Electrical conduits and wiring",
    },
    {
      category: "Other",
      description: "Site safety equipment",
      amount: 150_000,
      supplier: "Safety DZ",
      paymentMethod: "Cash",
      date: "2026-07-15",
      notes: "Helmets, gloves and safety vests",
    },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({
      data: {
        description: expense.description,
        amount: new Prisma.Decimal(expense.amount),
        supplier: expense.supplier,
        paymentMethod: expense.paymentMethod,
        date: new Date(expense.date),
        notes: expense.notes,

        project: {
          connect: {
            id: project.id,
          },
        },

        category: {
          connect: {
            id: categoryMap[expense.category],
          },
        },
      },
    });
  }

  console.log(`✅ ${expenses.length} expenses created`);

  // ─────────────────────────────────────
  // Summary
  // ─────────────────────────────────────

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const budget = 20_000_000;
  const remaining = budget - totalSpent;
  const budgetConsumed = (totalSpent / budget) * 100;

  console.log("\n📊 SiteOS Demo Data");
  console.log("----------------------------");
  console.log(`Project:          ${project.name}`);
  console.log(`Budget:           ${budget.toLocaleString()} DA`);
  console.log(`Total spent:      ${totalSpent.toLocaleString()} DA`);
  console.log(`Remaining:        ${remaining.toLocaleString()} DA`);
  console.log(`Budget consumed:  ${budgetConsumed.toFixed(1)}%`);
  console.log(`Progress:         ${project.progress}%`);
  console.log("----------------------------");

  if (budgetConsumed > project.progress) {
    console.log("⚠️ WARNING: Spending is ahead of project progress!");
  }

  console.log("\n🌱 Seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
