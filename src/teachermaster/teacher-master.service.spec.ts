import { Test, TestingModule } from '@nestjs/testing';
import { TeacherMasterService } from './teacher-master.service';

describe('TeacherMasterService', () => {
  let service: TeacherMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherMasterService],
    }).compile();

    service = module.get<TeacherMasterService>(TeacherMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
