import { Test, TestingModule } from '@nestjs/testing';
import { TeacherMasterController } from './teacher-master.controller';

describe('TeacherMasterController', () => {
  let controller: TeacherMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherMasterController],
    }).compile();

    controller = module.get<TeacherMasterController>(TeacherMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
