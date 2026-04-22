import { Test, TestingModule } from '@nestjs/testing';
import { ConferenceRequestController } from './conference-request.controller';
import { ConferenceRequestService } from './conference-request.service';

describe('ConferenceRequestController', () => {
  let controller: ConferenceRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConferenceRequestController],
      providers: [ConferenceRequestService],
    }).compile();

    controller = module.get<ConferenceRequestController>(ConferenceRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
