import { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/utils/emitter";

export function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function listener(value: string) {
      send({
        event: "message",
        data: value,
      });
    }

    emitter.on("message", listener);

    return function cleanup() {
      emitter.off("message", listener);
    };
  });
}
