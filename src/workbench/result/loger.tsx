import { searchLoggerWrapperClassName } from "../searchResult/base";

export function ResultLogger(props: any) {
  return <div className={searchLoggerWrapperClassName}>logger detail {JSON.stringify(props, null, 2)}</div>
}