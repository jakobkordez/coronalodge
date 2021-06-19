import { Request } from '../interfaces/request.interface';

export class RequestService {
  private requests: Map<string, Request> = new Map();

  public new(request: Request): void {
    this.requests.set(request.message_id, request);
  }

  public pick(message_id: string, index: number): string {
    const entry = this.requests.get(message_id);
    if (!entry || index < 0 || index > entry.track_ids.length - 1) return null;

    this.requests.delete(message_id);
    return entry.track_ids[index];
  }

  public delete(message_id: string): boolean {
    return this.requests.delete(message_id);
  }
}

export const requestService: RequestService = new RequestService();
