<!--
projektwahl - Diese Software kann eine Projektwahl verwalten, wie sie beispielsweise für eine Projektwoche benötigt wird.

Copyright (C) 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.


SPDX-FileCopyrightText: 2020 Moritz Hedtke <Moritz.Hedtke@t-online.de>

SPDX-License-Identifier: AGPL-3.0-or-later
-->
# projektwahl-pwa
[WORK-IN-PROGRESS] Diese Software kann eine Projektwahl verwalten, wie sie beispielsweise für eine Projektwoche benötigt wird.

# THIS ALL DOESNT WORK WELL ON NIXOS; JUST DONT USE IT FOR NOW
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH=$PWD/depot_tools:$PATH
export VPYTHON_BYPASS="manually managed python not supported by chrome operations"
export GCLIENT_PY3=0

# TODO FIXME use python2 or maybe set pyton2 env variable


mkdir webrtc-checkout
cd webrtc-checkout
nano args.gn
host_cpu="x64"
target_os="linux"
is_component_build=false
is_debug=false
is_clang=false
proprietary_codecs=true
use_custom_libcxx=false
use_system_libjpeg=false
use_rtti=true
use_gold=false
use_sysroot=false
linux_use_bundled_binutils=false
enable_dsyms=true
rtc_include_tests=false
rtc_build_examples=false
rtc_build_tools=false
rtc_build_opus=false
rtc_build_ssl=false
rtc_ssl_root="/usr/include"
rtc_ssl_libs=["ssl","crypto"]
rtc_builtin_ssl_root_certificates=true
rtc_build_ffmpeg=false
rtc_ffmpeg_root="/usr/include"
rtc_ffmpeg_libs=["avcodec","swscale","swresample","avutil"]
rtc_opus_root="/usr/include/opus"
rtc_enable_protobuf=false
treat_warnings_as_errors=false

fetch --nohooks webrtc
gclient sync





nix shell nixpkgs#llvm nixpkgs#clang nixpkgs#ninja nixpkgs#python3
git clone https://gn.googlesource.com/gn
cd gn
python build/gen.py
ninja -C out
out/gn_unittests

# https://webrtc.github.io/webrtc-org/native-code/development/#building


docker run -it -v $(pwd):/tmp/repo -w /tmp/repo ubuntu /bin/bash
apt update
apt install cmake npm
npm install

nix-shell --pure -p git cmake gcc nodejs-15_x python38 cacert curl



https://github.com/mohe2015/projektwahl/blob/main/src/server/index.ts
https://github.com/mohe2015/projektwahl/blob/main/src/server/server.ts

# Design

Initial setup: ask the server to exchange your username and password for a certificate that is signed by the server for a specific period of time

Use that certificate to ask any peer for the list of projects / users / ...
Use the certificate to update values (recommended to connect to a server for data consistency guarantee)

A user should be able to have multiple certificates

Revoking should be possible?

Best way would be to do all communication using WebRTC because then you would only need one technology. But probably WebSockets or http2 requests need to be used for client server communication



https://github.com/node-webrtc/node-webrtc
