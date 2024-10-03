# TransPerfect on-the-fly translations

## Table of Contents:

- [Technical background](#technical-background)
  - [Exclusions](#exclusions)
  - [Inclusions](#inclusions)
  - [Tagging](#tagging)
  - [Extended primitives](#extended-primitives)
- [Implementation](#implementation)
  - [Hierarchy](#hierarchy)

## Technical background

TransPerfect is an on-the-fly translation vendor that utilizes a crawler on the
DOM (initialized by a script in the document header) to identify translatable
strings and replace them with a target language interpretation. They employ
professional translators to review content on request and fill the gap in
not-yet-reviewed content with machine translations.

&nbsp;

### Exclusions

Exclusions from the TransPerfect service are marked with an HTML class of
`OneLinkNoTx`. Exclusions can include but are not limited to Patient
identifiable information, pharmacy names, and addresses. Exclusions should be
implemented by an extended primitive beginning with `Protected` (e.g.
`ProtectedView`, `ProtectedBaseText`).

Aside from explicitly excluded elements, the pages in myPrescriptive (namely
those using BasicPage), auto-exclude unless specified otherwise by props.

&nbsp;

### Inclusions

Inclusions from the TransPerfect service are marked with an HTML class of
`OneLinkTx`. Inclusions should be implemented by an extended primitive beginning
with `Translatable` (e.g. `TranslatableView`, `TranslatableBaseText`).

&nbsp;

### Tagging

"Tagging" elements entails marking an element for translation inclusion or
exclusion. Elements should be defined as translatable or non-translatable in
design and should ideally not be determined by nuance or developer.

&nbsp;

### Extended primitives

Extended primitives include `Translatable` and `Protected` components as listed
above. They are abstractions of primitives that add the corresponding className
to elements on the DOM.

In practice, this process works by assigning a `ref` to the rendered component,
and once the `ref` is defined, we assign the appropriate class name (`OneLinkTx`
or `OneLinkNoTx`). After assignment, children of the primitive will be rendered
to avoid strings being sent to TransPerfect before `ref` is defined.

Besides className being defined, all other functionality of base primitive will
be preserved.

&nbsp;

## Implementation

Following information given above, implementation would resemble below:

**Translatable**

_From_:

```
<View>
  {children}
</View>
```

_To_:

```
<TranslatableView>
  {children}
</TranslatableView>
```

**Protected**

_From_:

```
<View>
  {children}
</View>
```

_To_:

```
<ProtectedView>
  {children}
</ProtectedView>
```

&nbsp;

### Hierarchy

Hierarchy is intuitive with Translatable and Protected components being able to
be used in tandem. In the following case, it would be used for large blocks that
should be translated with a minor element part of the block that should be
marked as protected. Implementation would resemble as follows:

_From_:

```
<View>
  {translatableChildren}
  <View>
    {nonTranslatableChildren}
  </View>
</View>
```

_To_:

```
<TranslatableView>
  {translatableChildren}
  <ProtectedView>
    {nonTranslatableChildren}
  </ProtectedView>
</TranslatableView>
```
