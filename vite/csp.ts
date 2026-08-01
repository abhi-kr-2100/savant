import type { Plugin } from 'vite';
import { parse, type DefaultTreeAdapterMap, type Token } from 'parse5';
import parseContentSecurityPolicy from 'content-security-policy-parser';

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type Location = Token.Location;
type AttrValWithLocation = { valueStart: number; value: string };

const DEFAULT_DEV_SOURCES: Record<string, string[]> = {
  'connect-src': ['ws://localhost:5173'],
  'style-src': ["'unsafe-inline'"],
};

const CSP_HTTP_EQUIV = 'content-security-policy';
const HTTP_EQUIV = 'http-equiv';

function* walk(node: Node): Generator<Node> {
  yield node;
  if ('childNodes' in node) {
    for (const child of node.childNodes) yield* walk(child);
  }
}

function isCspMeta(node: Element): boolean {
  return node.attrs.some(
    (attr) => attr.name.toLowerCase() === HTTP_EQUIV && attr.value.toLowerCase() === CSP_HTTP_EQUIV,
  );
}

const WHITESPACE = [' ', '\t', '\n'];
function isWhitespace(s: string): boolean {
  if (s.length === 0) {
    return false;
  }
  return [...s].every((ch) => WHITESPACE.includes(ch));
}

function attrValue(html: string, location: Location): AttrValWithLocation {
  const raw = html.slice(location.startOffset, location.endOffset);

  let quote = raw.indexOf('=') + 1;
  while (quote < raw.length && isWhitespace(raw[quote]!)) {
    quote++;
  }

  if (quote >= raw.length) {
    throw new Error('CSP meta tag has no content');
  }

  if (raw[quote] !== '"' && raw[quote] !== "'") {
    throw new Error('CSP meta tag content attribute must be quoted');
  }

  return { valueStart: location.startOffset + quote + 1, value: raw.slice(quote + 1, -1) };
}

function findCspMetaContent(html: string): AttrValWithLocation {
  const doc = parse(html, { sourceCodeLocationInfo: true });

  for (const node of walk(doc)) {
    if (!('tagName' in node) || node.tagName !== 'meta' || !isCspMeta(node)) {
      continue;
    }

    const location = node.sourceCodeLocation?.attrs?.['content'];
    if (!location) {
      throw new Error('CSP meta tag must have a content attribute');
    }

    return attrValue(html, location);
  }

  throw new Error('index.html must contain a Content-Security-Policy meta tag');
}

function serialize(policy: Map<string, string[]>): string {
  return [...policy]
    .map(([name, sources]) => (sources.length ? `${name} ${sources.join(' ')}` : name))
    .join('; ');
}

function mergeSources(
  policy: Map<string, string[]>,
  additions: Record<string, string[]>,
): Map<string, string[]> {
  const merged = new Map(policy);
  for (const [directive, sources] of Object.entries(additions)) {
    merged.set(directive, [...new Set([...(policy.get(directive) ?? []), ...sources])]);
  }
  return merged;
}

function replaceValue(
  html: string,
  valueWithLocation:AttrValWithLocation,
  replacement: string,
): string {
  const { valueStart, value } = valueWithLocation;
  return html.slice(0, valueStart) + replacement + html.slice(valueStart + value.length);
}

export function rendererCsp(devSources: Record<string, string[]> = DEFAULT_DEV_SOURCES): Plugin {
  return {
    name: 'renderer-csp',
    transformIndexHtml: {
      order: 'post',
      handler: (html, ctx) => {
        if (!ctx.server) {
          return html;
        }

        const valueWithLocation = findCspMetaContent(html);
        const policy = parseContentSecurityPolicy(valueWithLocation.value);
        const merged = mergeSources(policy, devSources);
        return replaceValue(html, valueWithLocation, serialize(merged));
      },
    },
  };
}
