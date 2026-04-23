import { HttpError } from '../../middleware/error-handler.js';
import type { ApplyRepository, CreateApplicationInput, ApplicationRecord } from './apply.repository.js';

export type ApplyResponseDto = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  programId: string;
  programName: string | null;
  status: string;
  answers: Record<string, unknown>;
  createdAt: string;
  // New fields
  collegeName: string | null;
  applicantStatus: string | null;
  currentYearOrExperience: string | null;
  motivation: string | null;
};

export class ApplyService {
  constructor(private readonly repository: ApplyRepository) {}

  async submit(input: CreateApplicationInput): Promise<ApplyResponseDto> {
    const exists = await this.repository.programExists(input.programId);
    if (!exists) {
      throw new HttpError(400, 'Invalid program selected');
    }

    // Check for duplicate application
    const alreadyApplied = await this.repository.checkExistingApplication(
      input.email,
      input.programId
    );
    if (alreadyApplied) {
      throw new HttpError(409, 'You have already applied for this program');
    }

    const row = await this.repository.createApplication(input);

    // Send confirmation email asynchronously (non-blocking)
    this.sendConfirmationEmail(row).catch((err) => {
      console.error('[ApplyService] Failed to send confirmation email:', err);
    });

    return this.mapToResponseDto(row);
  }

  private async sendConfirmationEmail(app: ApplicationRecord): Promise<void> {
    // TODO: Implement email service integration
    // For now, just log the intent
    console.log(`[ApplyService] Would send confirmation email to ${app.email} for program ${app.program_id}`);
  }

  async listApplications(filters: {
    programId?: string;
    programIds?: string[];
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ applications: ApplyResponseDto[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    const rows = await this.repository.getApplications({
      programId: filters.programId,
      programIds: filters.programIds,
      status: filters.status,
      search: filters.search,
      limit,
      offset,
    });
    const total = await this.repository.countApplications({
      programId: filters.programId,
      programIds: filters.programIds,
      status: filters.status,
      search: filters.search,
    });

    return {
      applications: rows.map((row) => this.mapToResponseDto(row)),
      total,
    };
  }

  async exportApplications(filters: {
    programId?: string;
    programIds?: string[];
    status?: string;
    search?: string;
  }): Promise<string> {
    // Fetch all matching applications (no pagination for export)
    const rows = await this.repository.getApplications({
      programId: filters.programId,
      programIds: filters.programIds,
      status: filters.status,
      search: filters.search,
      limit: 10000, // Max export limit
      offset: 0,
    });

    // CSV Header
    const headers = ['Name', 'Email', 'Phone', 'Program', 'Status', 'Applied At'];
    const csvRows = [headers.join(',')];

    // CSV Data
    for (const row of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const programName = (row as any).program_title ?? row.program_id;
      const csvRow = [
        this.escapeCsv(row.name),
        this.escapeCsv(row.email),
        this.escapeCsv(row.phone ?? ''),
        this.escapeCsv(programName ?? ''),
        this.escapeCsv(row.status),
        this.escapeCsv(row.created_at.toISOString()),
      ];
      csvRows.push(csvRow.join(','));
    }

    return csvRows.join('\n');
  }

  private escapeCsv(value: string): string {
    // Escape values that contain commas, quotes, or newlines
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  async getApplicationById(id: string): Promise<ApplyResponseDto> {
    const row = await this.repository.getApplicationById(id);
    if (!row) {
      throw new HttpError(404, 'Application not found');
    }
    return this.mapToResponseDto(row);
  }

  async updateApplicationStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'rejected'
  ): Promise<ApplyResponseDto> {
    const row = await this.repository.updateStatus(id, status);
    if (!row) {
      throw new HttpError(404, 'Application not found');
    }
    return this.mapToResponseDto(row);
  }

  private mapToResponseDto(row: ApplicationRecord & { program_title?: string | null }): ApplyResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      programId: row.program_id,
      programName: row.program_title ?? null,
      status: row.status,
      answers: row.answers,
      createdAt: row.created_at.toISOString(),
      collegeName: row.college_name,
      applicantStatus: row.applicant_status,
      currentYearOrExperience: row.current_year_or_experience,
      motivation: row.motivation,
    };
  }
}
