import { prisma } from '@/lib/prisma';

export class SystemSettingService {
    async getCalculatorSettings() {
        let settings = await prisma.systemSetting.findFirst();
        if (!settings) {
            settings = await prisma.systemSetting.create({
                data: {} // Uses schema defaults
            });
        }
        return settings;
    }

    async updateCalculatorSettings(data: any) {
        let settings = await prisma.systemSetting.findFirst();
        if (!settings) {
            settings = await prisma.systemSetting.create({
                data: {}
            });
        }
        return await prisma.systemSetting.update({
            where: { id: settings.id },
            data,
        });
    }
}
