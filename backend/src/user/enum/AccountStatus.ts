/**
 * Account status enum for user lifecycle management.
 * Controls what actions users can perform based on their status.
 */
export enum AccountStatus {
    /**
     * Account is fully active and operational.
     */
    ACTIVE = 'active',

    /**
     * Account created but email not yet verified.
     * Limited functionality until verification.
     */
    UNVERIFIED = 'unverified',

    /**
     * Account has been suspended by admin.
     * User cannot login or perform any actions.
     */
    SUSPENDED = 'suspended',

    /**
     * Account has been soft-deleted.
     * User cannot login, data retained for recovery period.
     */
    DELETED = 'deleted',
}
