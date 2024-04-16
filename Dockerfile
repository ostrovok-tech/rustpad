FROM rust:alpine as backend
RUN apk --no-cache add musl-dev openssl-dev
WORKDIR /app
COPY . .
RUN cargo test --release
RUN cargo build --release

FROM rust:alpine as wasm
RUN apk --no-cache add curl musl-dev pkgconfig openssl-dev
WORKDIR /app
COPY . .
RUN cargo install wasm-pack
RUN wasm-pack build --target web rustpad-wasm

FROM node:lts-alpine as frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . .
COPY --from=wasm /app/rustpad-wasm/pkg rustpad-wasm/pkg
ARG VERSION_SHA
ENV VITE_SHA=${VERSION_SHA}
RUN pnpm install && pnpm build

FROM scratch
WORKDIR /app
COPY --from=frontend /app/dist dist
COPY --from=backend /app/target/release/rustpad-server .
USER 1000:1000
CMD [ "./rustpad-server" ]
