import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceRequestService } from './conference-request.service';

describe('ConferenceRequestService', () => {
  let service: ConferenceRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConferenceRequestService],
    }).compile();

    service = module.get<ConferenceRequestService>(ConferenceRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
