FROM alpine:latest
RUN apk add --no-cache curl
COPY check_health.sh /check_health.sh
RUN chmod +x /check_health.sh
CMD ["/check_health.sh"]
