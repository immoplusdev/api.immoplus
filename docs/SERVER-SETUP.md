# Server config for centos

1. Add new user and give him root
   priviledges => https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-a-centos-7-server

2. Use sudo without password

- Run the following command: `sudo visudo`

- Add the following to the bottom of the file and substitute 'username' with your username:
  `username ALL=(ALL) NOPASSWD:ALL`

3. Give root priviledges to user `usermod -aG sudo username` on centos 7 `sudo usermod -aG wheel username`

4. Disable root login (
   Optional ) => https://www.ionos.com/help/server-cloud-infrastructure/getting-started/important-security-information-for-your-server/deactivating-the-ssh-root-login/

5. Use sudo without password: Add the following line at the end of the file, replacing username with the actual
   username: `username ALL=(ALL) NOPASSWD:ALL`

## Git

1. Install git => https://www.digitalocean.com/community/tutorials/how-to-install-git-on-centos-7

2. Persists git credentials: Run `git config --global credential.helper store` and
   `sudo git config --global credential.helper store`

3. Configure git credentials
    - `git config --global user.name "Your Name"`
    - `git config --global user.email "you@example.com"`

4. Check git configs: `git config --list`

# Docker

1. Ubuntu install docker => https://docs.docker.com/engine/install/ubuntu/


# Clone project
 Run : `git clone https://access-token@github.com/username/repository.git`