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
  PaginatedSubmissionsResponse,
  GetSubmissionsParams,
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

interface UsePaginatedSubmissionsReturn {
  paginatedSubmissions: UseQueryResult<PaginatedSubmissionsResponse, Error>;
}

export const useSubmission = (
  problemUuid?: string,
  submissionUuid?: string,
  userUuid?: string
): UseSubmissionsReturn => {
  const queryClient = useQueryClient();

  // 🟢 Get all submissions (either for a user, or for a problem)
  const allSubmissionsQuery = useQuery<any, Error>({
    queryKey: ["submissions", { userUuid, problemUuid }],
    queryFn: async () => {
      let endpoint = "";
      if (userUuid && userUuid !== "undefined") {
        endpoint = `/submission/problem/user/${userUuid}`;
      } else if (problemUuid && problemUuid !== "undefined") {
        endpoint = `/submission/problem/${problemUuid}`;
      } else {
        // Return empty array instead of throwing if no ID is provided, 
        // this avoids unnecessary error states in components using only part of the hook
        return [];
      }

      const response = await api.get(endpoint);
      return response.data;
    },
    enabled: (Boolean(userUuid) && userUuid !== "undefined") || (Boolean(problemUuid) && problemUuid !== "undefined"),
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

      // Refresh submissions list if either ID is valid
      if ((userUuid && userUuid !== "undefined") || (problemUuid && problemUuid !== "undefined")) {
        await allSubmissionsQuery.refetch();
      }

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

/**
 * Hook for paginated submissions with filters
 */
export const usePaginatedSubmissions = (
  params: GetSubmissionsParams
): UsePaginatedSubmissionsReturn => {
  const paginatedSubmissionsQuery = useQuery<
    PaginatedSubmissionsResponse,
    Error
  >({
    queryKey: ["submissions", "paginated", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.search) queryParams.append("search", params.search);
      if (params.userId) queryParams.append("userId", params.userId);
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);

      const response = await api.get<PaginatedSubmissionsResponse>(
        `/submission?${queryParams.toString()}`
      );
      return response.data;
    },
    enabled: true,
  });

  return {
    paginatedSubmissions: paginatedSubmissionsQuery,
  };
};
