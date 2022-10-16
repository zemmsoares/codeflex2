FROM debian:latest
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y openssh-server
RUN mkdir /var/run/sshd

RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN service ssh restart

RUN echo 'root:root' | chpasswd

RUN apt-get install -y default-jre
RUN apt-get install -y default-jdk

RUN apt-get install -y firejail
RUN apt-get install -y parallel

RUN apt install -y mono-mcs 

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]