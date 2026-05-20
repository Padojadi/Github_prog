import { Test, TestingModule } from '@nestjs/testing';
import { ReferentielsController } from './referentiels.controller';
import { ReferentielsService } from './referentiels.service';

describe('ReferentielsController', () => {
  let controller: ReferentielsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferentielsController],
      providers: [ReferentielsService],
    }).compile();

    controller = module.get<ReferentielsController>(ReferentielsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
