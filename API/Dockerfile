FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

# Stage 1: Build the project
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY k8ApiDemo/k8ApiDemo.csproj k8ApiDemo/
RUN dotnet restore k8ApiDemo/k8ApiDemo.csproj

COPY . .
WORKDIR /src/k8ApiDemo
RUN dotnet build -c Release -o /app/build

# Stage 2: Publish the project
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 3: Final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "k8ApiDemo.dll"]