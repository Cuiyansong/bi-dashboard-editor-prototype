/** 看板级筛选：各模板共用七大客群、客户分层（多选） */

import {
  CUSTOMER_FILTER_DEFS,
  type CustomerFilterId,
  type CustomerFilterState,
  defaultCustomerFilterState,
} from "./customerFilters";

export type { CustomerFilterId, CustomerFilterState };
export { CUSTOMER_FILTER_DEFS, defaultCustomerFilterState };

export function getTemplateFilters() {
  return CUSTOMER_FILTER_DEFS;
}

export function defaultFilterState(_templateId?: string): CustomerFilterState {
  return defaultCustomerFilterState();
}
