// src/hooks/useProblem.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import api from "../services/api";
import {
  CreateProblemInput,
  ProblemResponse,
  ProblemsResponse,
  PaginatedProblemsResponse,
  GetProblemsParams,
} from "@/types/problems";

interface UseProblemsReturn {
  allProblems: UseQueryResult<
    ProblemsResponse, // response
    Error // error
  >;

  singleProblem: UseQueryResult<ProblemResponse, Error>;

  createProblem: UseMutationResult<
    ProblemResponse, // response
    Error, // error
    CreateProblemInput, // input creds
    unknown
  >["mutateAsync"];
}

interface UsePaginatedProblemsReturn {
  paginatedProblems: UseQueryResult<PaginatedProblemsResponse, Error>;
}

export const useProblem = (uuid?: string): UseProblemsReturn => {
  const queryClient = useQueryClient();

  // Get all problems
  const allProblemsQuery = useQuery<ProblemsResponse, Error>({
    queryKey: ["problems"],
    queryFn: async () => {
      const response = await api.get<ProblemsResponse>("/problems");
      return response.data;
    },
    enabled: false, // only run if slug is not provided
  });

  // Get one problem by slug
  const singleProblemQuery = useQuery<ProblemResponse, Error>({
    queryKey: ["problem", uuid],
    queryFn: async () => {
      const response = await api.get<ProblemResponse>(`/problems/${uuid}`);
      return response.data;
    },
    enabled: !!uuid, // only run if slug is provided
  });

  // Create a problem
  const createProblemMutation = useMutation<
    ProblemResponse,
    Error,
    CreateProblemInput
  >({
    mutationFn: async (
      newProblem: CreateProblemInput
    ): Promise<ProblemResponse> => {
      const response = await api.post<ProblemResponse>("/problems", newProblem);
      return response.data;
    },
    onSuccess: async () => {
      console.log({ check: 'coming here' });

      // Refresh the problems list after creation
      await allProblemsQuery.refetch()
      // queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });

  return {
    allProblems: allProblemsQuery,
    singleProblem: singleProblemQuery,
    createProblem: createProblemMutation.mutateAsync,
  };
};

/**
 * Hook for paginated problems with filters
 */
export const usePaginatedProblems = (
  params: GetProblemsParams
): UsePaginatedProblemsReturn => {
  const paginatedProblemsQuery = useQuery<
    PaginatedProblemsResponse,
    Error
  >({
    queryKey: ["problems", "paginated", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      // Always include page and pageSize to ensure paginated response
      queryParams.append("page", (params.page || 1).toString());
      queryParams.append("pageSize", (params.pageSize || 10).toString());
      if (params.difficulty) queryParams.append("difficulty", params.difficulty);
      if (params.search) queryParams.append("search", params.search);
      if (params.tag) queryParams.append("tag", params.tag);
      if (params.pattern) queryParams.append("pattern", params.pattern);
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);

      const response = await api.get<any>(
        `/problems?${queryParams.toString()}`
      );
      const raw = response.data;
      // Backend may return { data, meta } directly or wrapped in ResponseWrapper { data: { data, meta }, message, ... }
      if (raw?.data?.data && raw?.data?.meta) {
        return raw.data as PaginatedProblemsResponse;
      }
      if (raw?.data && raw?.meta) {
        return raw as PaginatedProblemsResponse;
      }
      return raw as PaginatedProblemsResponse;
    },
    enabled: true,
  });

  return {
    paginatedProblems: paginatedProblemsQuery,
  };
};
