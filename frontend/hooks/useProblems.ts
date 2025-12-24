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
      console.log({check:'coming here'});
      
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
