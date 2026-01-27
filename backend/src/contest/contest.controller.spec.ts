import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { ContestTab, ContestFormat } from './dto/contest-query.dto';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ContestController', () => {
    let controller: ContestController;
    let service: ContestService;

    const mockClistResponse = {
        meta: { limit: 50, offset: 0, total_count: 2 },
        objects: [
            {
                id: 1,
                event: 'Codeforces Round #999',
                host: 'codeforces.com',
                href: 'https://codeforces.com/contest/1234',
                start: '2026-01-30T12:00:00Z',
                end: '2026-01-30T14:00:00Z',
                duration: 7200,
                resource: { id: 1, name: 'codeforces.com', icon: 'https://codeforces.com/favicon.ico' },
            },
            {
                id: 2,
                event: 'LeetCode Weekly Contest 400',
                host: 'leetcode.com',
                href: 'https://leetcode.com/contest/weekly-400',
                start: '2026-01-31T10:00:00Z',
                end: '2026-01-31T11:30:00Z',
                duration: 5400,
                resource: { id: 2, name: 'leetcode.com', icon: 'https://leetcode.com/favicon.ico' },
            },
        ],
    };

    const mockKontestsResponse = [
        {
            name: 'Codeforces Round #1000',
            url: 'https://codeforces.com/contest/1235',
            start_time: '2026-02-01T12:00:00Z',
            end_time: '2026-02-01T14:00:00Z',
            duration: '7200',
            site: 'CodeForces',
            in_24_hours: 'No',
            status: 'BEFORE',
        },
    ];

    beforeEach(async () => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock axios.create to return a mock client
        mockedAxios.create.mockReturnValue({
            get: jest.fn().mockResolvedValue({ data: mockClistResponse }),
        } as any);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContestController],
            providers: [
                ContestService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config: Record<string, any> = {
                                CLIST_API_USERNAME: 'testuser',
                                CLIST_API_KEY: 'testapikey',
                                CLIST_CACHE_TTL_SECONDS: 300,
                                CLIST_RATE_LIMIT_PER_MINUTE: 10,
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        controller = module.get<ContestController>(ContestController);
        service = module.get<ContestService>(ContestService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('GET /api/contests', () => {
        it('should return upcoming contests by default', async () => {
            const result = await controller.getContests({});

            expect(result).toBeDefined();
            expect((result as any).success).toBe(true);
            expect((result as any).data).toBeInstanceOf(Array);
        });

        it('should filter by tab parameter', async () => {
            const result = await controller.getContests({ tab: ContestTab.ONGOING });

            expect(result).toBeDefined();
            expect((result as any).success).toBe(true);
        });

        it('should apply platform filter', async () => {
            const result = await controller.getContests({
                platforms: 'codeforces.com,leetcode.com'
            });

            expect(result).toBeDefined();
        });

        it('should apply search filter', async () => {
            const result = await controller.getContests({
                search: 'Codeforces'
            });

            expect(result).toBeDefined();
        });

        it('should respect limit parameter', async () => {
            const result = await controller.getContests({ limit: 10 });

            expect(result).toBeDefined();
        });

        it('should handle format passthrough', async () => {
            const result = await controller.getContests({
                format: ContestFormat.JSON
            });

            expect(result).toBeDefined();
        });
    });
});

describe('ContestService', () => {
    let service: ContestService;

    beforeEach(async () => {
        jest.clearAllMocks();

        mockedAxios.create.mockReturnValue({
            get: jest.fn().mockResolvedValue({ data: mockClistResponse }),
        } as any);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ContestService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            const config: Record<string, any> = {
                                CLIST_API_USERNAME: 'testuser',
                                CLIST_API_KEY: 'testapikey',
                                CLIST_CACHE_TTL_SECONDS: 300,
                                CLIST_RATE_LIMIT_PER_MINUTE: 10,
                            };
                            return config[key];
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<ContestService>(ContestService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should cache responses', async () => {
        // First call - should fetch
        const first = await service.getContests({});
        expect(first.meta.cached).toBe(false);

        // Second call - should use cache
        const second = await service.getContests({});
        expect(second.meta.cached).toBe(true);
    });

    it('should normalize CLIST response correctly', async () => {
        const result = await service.getContests({});

        expect(result.data[0]).toMatchObject({
            id: expect.any(Number),
            event: expect.any(String),
            host: expect.any(String),
            href: expect.any(String),
            start: expect.any(String),
            end: expect.any(String),
            duration: expect.any(Number),
            status: expect.stringMatching(/^(ongoing|upcoming)$/),
            platform: {
                name: expect.any(String),
                icon: expect.any(String),
                url: expect.any(String),
            },
        });
    });
});

// Mock data used across tests
const mockClistResponse = {
    meta: { limit: 50, offset: 0, total_count: 2 },
    objects: [
        {
            id: 1,
            event: 'Codeforces Round #999',
            host: 'codeforces.com',
            href: 'https://codeforces.com/contest/1234',
            start: '2026-01-30T12:00:00Z',
            end: '2026-01-30T14:00:00Z',
            duration: 7200,
            resource: { id: 1, name: 'codeforces.com', icon: 'https://codeforces.com/favicon.ico' },
        },
        {
            id: 2,
            event: 'LeetCode Weekly Contest 400',
            host: 'leetcode.com',
            href: 'https://leetcode.com/contest/weekly-400',
            start: '2026-01-31T10:00:00Z',
            end: '2026-01-31T11:30:00Z',
            duration: 5400,
            resource: { id: 2, name: 'leetcode.com', icon: 'https://leetcode.com/favicon.ico' },
        },
    ],
};
