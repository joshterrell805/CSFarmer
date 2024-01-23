import net.csfarmer.CSF

allprojects {
    group = CSF.group
    version = CSF.version
}


println(
    """
        ${group}:${version}
        JVM: ${CSF.DependencyVersions.jvm}
    """.trimIndent()
)