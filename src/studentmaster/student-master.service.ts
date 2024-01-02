import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class StudentMasterService {
    private filepath: string;
    constructor() {
        this.filepath = path.basename(__filename);
    }
}