import { ArgumentMetadata, BadRequestException, ParseUUIDPipe } from '@nestjs/common';

export class EnhancedParseUUIDPipe extends ParseUUIDPipe {
    async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
        try {
            console.log(metadata);
            return await super.transform(value, metadata);
        } catch {
            throw new BadRequestException([{ message: 'UUID not valid', field: metadata.data }]);
        }
    }
}
