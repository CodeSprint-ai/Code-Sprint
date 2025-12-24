import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import api from "../services/api"; // same axios instance you already have
import {
  SubmissionResponse,
  SubmissionsResponse,
  CreateSubmissionInput,
} from "@/types/submission";

interface UseSubmissionsReturn {
  allSubmissions: UseQueryResult<SubmissionsResponse, Error>;
  singleSubmission: UseQueryResult<SubmissionResponse, Error>;
  createSubmission: UseMutationResult<
    SubmissionResponse,
    Error,
    CreateSubmissionInput,
    unknown
  >["mutateAsync"];
  createSubmissionLoading: boolean;
}

export const useSubmission = (
  problemUuid?: string,
  submissionUuid?: string,
  userUuid?: string
): UseSubmissionsReturn => {
  const queryClient = useQueryClient();

  // 🟢 Get all submissions for a user
  const allSubmissionsQuery = useQuery<SubmissionsResponse, Error>({
    queryKey: ["submissions", userUuid],
    queryFn: async () => {
      const response = await api.get<SubmissionsResponse>(
        `/submission/problem/user/${userUuid}`
      );
      return response.data;
    },
    enabled: Boolean(userUuid),
  });


  // 🟢 Get single submission by ID
  const singleSubmissionQuery = useQuery<SubmissionResponse, Error>({
    queryKey: ["submission", submissionUuid],
    queryFn: async () => {
      const response = await api.get<SubmissionResponse>(
        `/submission/${submissionUuid}`
      );
      return response.data;
    },
    enabled: !!submissionUuid,
  });

  // 🟢 Create a new submission
  const createSubmissionMutation = useMutation<
    SubmissionResponse,
    Error,
    CreateSubmissionInput
  >({
    mutationFn: async (
      newSubmission: CreateSubmissionInput
    ): Promise<SubmissionResponse> => {
      const response = await api.post<SubmissionResponse>(
        `/submission`,
        newSubmission
      );
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("✅ Submission created:", data);

      // Refresh submissions list
      await allSubmissionsQuery.refetch();

      // Or optionally invalidate cache if you prefer
      // queryClient.invalidateQueries({ queryKey: ["submissions", problemSlug] });
    },
  });

  return {
    allSubmissions: allSubmissionsQuery,
    singleSubmission: singleSubmissionQuery,
    createSubmission: createSubmissionMutation.mutateAsync,
    createSubmissionLoading: createSubmissionMutation.isPending,
  };
};
