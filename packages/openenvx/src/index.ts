import * as p from "@clack/prompts";
import color from "picocolors";
import { Command } from "commander";
import { type ProjectConfig } from "./generators/project-generator";
import { generateProject } from "./generators/project-generator";

const program = new Command();

program
  .name("openenvx")
  .description("OpenEnvx CLI - Create and manage OpenEnvx SaaS apps")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize a new OpenEnvx project")
  .argument("[project-directory]", "Directory to create the project in")
  .action(async (projectDirectory) => {
    p.intro(color.bgCyan(color.black(" create-openenvx-app ")));

    const group = await p.group(
      {
        name: () =>
          p.text({
            message: "What is your project named?",
            placeholder: projectDirectory || "my-app",
            initialValue: projectDirectory,
            validate: (value: string | undefined) => {
              if (!value) return "Project name is required";
              if (!/^[a-z0-9-_]+$/i.test(value)) {
                return "Only letters, numbers, hyphens, and underscores allowed";
              }
            },
          }),
        features: () =>
          p.multiselect({
            message: "Select features to include:",
            options: [
              { value: "stripe", label: "Stripe Payments" },
              { value: "storage", label: "S3 File Storage" },
              { value: "email", label: "Email (Resend)" },
            ],
          }),
      },
      {
        onCancel: () => {
          p.cancel("Operation cancelled.");
          process.exit(0);
        },
      },
    );

    const config: ProjectConfig = {
      name: group.name,
      projectName: group.name,
      features: {
        stripe: group.features.includes("stripe"),
        storage: group.features.includes("storage"),
        email: group.features.includes("email"),
      },
      database: "postgresql",
    };

    p.log.step("Creating your project...");

    try {
      for await (const entry of generateProject(config)) {
        if (entry.level === "spinner") {
          p.log.step(entry.message);
        } else if (entry.level === "success") {
          p.log.success(entry.message);
        } else if (entry.level === "error") {
          p.log.error(entry.message);
        } else {
          p.log.message(entry.message);
        }
      }

      const nextSteps = `cd ${config.name}
cp .env.example .env.local
bun dev`;

      p.note(nextSteps, "Next steps");
      p.outro(color.green("Project created successfully!"));
    } catch (err) {
      p.log.error(
        err instanceof Error ? err.message : "Unknown error occurred",
      );
      process.exit(1);
    }
  });

program.parse();
