Follow this to be able to upload images:

Edit security settings in wwwroot folder
and give full permission.
Windows:
`icacls "C:\inetpub\wwwroot\images" /grant "IIS AppPool\DefaultAppPool:(OI)(CI)RW"`

MacOs:
`chmod 777 PATH-TO-FOLDER/popstarAPI/wwwroot/images`

Run:
(.NET version 7.x only)
`dotnet run`
